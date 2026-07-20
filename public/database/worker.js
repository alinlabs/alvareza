/**
 * Cloudflare Worker for portofolio.alvareza-work
 * Binding: d1_database
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const pathname = url.pathname.replace(/^\/|\/$/g, ''); // Remove leading and trailing slashes
      const method = request.method;

      // 2. Validasi endpoint dasar
      if (!pathname) {
        return jsonResponse({
          success: true,
          message: 'Welcome to Portofolio API. Please specify an endpoint.',
          endpoints: [
            '/profil',
            '/keahlian',
            '/keahlian-kategori',
            '/kejuaraan',
            '/pelatihan',
            '/pencapaian',
            '/pendidikan',
            '/pengalaman-kerjasama',
            '/pengalaman-organisasi',
            '/pengalaman-profesi',
            '/portofolio',
            '/cover-letter-templates',
            '/email-sender',
            '/rekruter'
          ],
          data: null
        });
      }

      // 3. Konfigurasi Skema Tabel (Whitelist & Format Kolom)
      const schema = {
        'profil': {
          jsonColumns: ['alamat_tempat_tinggal']
        },
        'keahlian': {
          jsonColumns: ['penguasaan']
        },
        'kejuaraan': {
          jsonColumns: []
        },
        'pelatihan': {
          jsonColumns: ['hasil']
        },
        'pencapaian': {
          jsonColumns: []
        },
        'pendidikan': {
          jsonColumns: ['deskripsi', 'sertifikat']
        },
        'pengalaman_kerjasama': {
          jsonColumns: ['tujuan', 'dampak']
        },
        'pengalaman_organisasi': {
          jsonColumns: ['pencapaian']
        },
        'pengalaman_profesi': {
          jsonColumns: ['spesialisasi', 'tugas_tanggung_jawab', 'ringkasan']
        },
        'portofolio': {
          jsonColumns: ['teknologi', 'fitur']
        },
        'cover_letter_templates': {
          jsonColumns: ['rekomendasi']
        },
        'email_sender': {
          jsonColumns: [
            'include_perihal', 'include_lampiran_awal', 'include_daftar_lampiran', 'include_bio'
          ]
        },
        'email_template': {
          jsonColumns: []
        },
        'rekruter': {
          jsonColumns: []
        }
      };

      // Sanitasi nama tabel
      const tableName = pathname.replace(/-/g, '_'); 
      const tableConfig = schema[tableName];

      if (!tableConfig) {
        return jsonResponse({
          success: false,
          message: 'Endpoint not found or invalid',
          error: 'Not Found',
          data: null
        }, 404);
      }

      // 4. Routing berdasarkan Method
      if (method === 'GET') {
        if (!env.d1_database) {
          return jsonResponse({
            success: false,
            message: 'Database binding (d1_database) not found',
            error: 'Configuration Error',
            data: null
          }, 500);
        }

        
        // Query ke D1 Database
        const { results } = await env.d1_database.prepare(`SELECT * FROM ${tableName}`).all();

        // Helper to convert snake_case to camelCase
        const toCamel = (s) => {
          return s.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
              .replace('-', '')
              .replace('_', '');
          });
        };

        const formatKeys = (obj) => {
          const newObj = {};
          for (let key in obj) {
            newObj[toCamel(key)] = obj[key];
          }
          return newObj;
        };

        // 5. Parse JSON columns yang disimpan sebagai TEXT di SQLite (D1)
        const formattedResults = results.map(row => {
          const formattedRow = { ...row };
          for (const col of tableConfig.jsonColumns) {
            if (formattedRow[col] && typeof formattedRow[col] === 'string') {
              try {
                formattedRow[col] = JSON.parse(formattedRow[col]);
              } catch (e) {
                console.warn(`Gagal parse JSON di kolom ${col} tabel ${tableName}:`, formattedRow[col]);
              }
            }
          }
          return formatKeys(formattedRow);
        });

        // Normalize profil to single object if needed
        let responseData = formattedResults;
        if (tableName === 'profil' && formattedResults.length > 0) {
          responseData = formattedResults[0];
        }

        return jsonResponse({
          success: true,
          message: `Successfully retrieved data from ${tableName}`,
          data: responseData
        });

      }

      // 4b. Write Operations (POST, PUT, DELETE)
      if (['POST', 'PUT', 'DELETE'].includes(method)) {
        if (!env.d1_database) {
          return jsonResponse({ success: false, message: 'DB not found', data: null }, 500);
        }

        const body = await request.json().catch(() => ({}));
        
        // Helper to convert camelCase to snake_case
        const toSnake = (s) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        
        // Helper to prepare data for DB
        const prepData = (obj) => {
          const newObj = {};
          for (let key in obj) {
            let val = obj[key];
            if (val !== null && typeof val === 'object') {
              val = JSON.stringify(val);
            } else if (typeof val === 'boolean') {
              val = val ? 1 : 0; // SQLite boolean
            }
            newObj[toSnake(key)] = val;
          }
          return newObj;
        };

        try {
          if (method === 'POST' || method === 'PUT') {
            if (Array.isArray(body)) {
               const { results: currentData } = await env.d1_database.prepare(`SELECT id FROM ${tableName}`).all();
               const currentIds = currentData.map(item => item.id);
               const newIds = body.map(item => item.id).filter(id => id);
               
               const toDeleteIds = currentIds.filter(id => !newIds.includes(id));
               const toUpdate = body.filter(item => item.id && currentIds.includes(item.id));
               const toAdd = body.filter(item => !item.id || !currentIds.includes(item.id));
               
               const stmts = [];
               for (const id of toDeleteIds) {
                  stmts.push(env.d1_database.prepare(`DELETE FROM ${tableName} WHERE id = ?`).bind(id));
               }
               for (const item of toUpdate) {
                  const data = prepData(item);
                  const id = data.id;
                  delete data.id;
                  const columns = Object.keys(data);
                  const setClause = columns.map(c => `${c} = ?`).join(', ');
                  const values = [...Object.values(data), id];
                  stmts.push(env.d1_database.prepare(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`).bind(...values));
               }
               for (const item of toAdd) {
                  const data = prepData(item);
                  if (!data.id) delete data.id;
                  const columns = Object.keys(data);
                  const placeholders = columns.map(() => '?').join(', ');
                  const values = Object.values(data);
                  stmts.push(env.d1_database.prepare(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`).bind(...values));
               }
               
               if (stmts.length > 0) {
                  await env.d1_database.batch(stmts);
               }
               return jsonResponse({ success: true, message: 'Bulk data synced', data: body });
            }
          }
          
          if (method === 'POST') {
            const data = prepData(body);
            if (!data.id) delete data.id;
            const columns = Object.keys(data);
            const placeholders = columns.map(() => '?').join(', ');
            const values = Object.values(data);
            
            const query = `INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
            await env.d1_database.prepare(query).bind(...values).run();
            
            return jsonResponse({ success: true, message: 'Data inserted', data });
          }
          
          if (method === 'PUT') {
            const data = prepData(body);
            let pk = 'id';
            let pkValue = data.id;
            
            if (tableName === 'profil') {
               pk = 'nama';
               pkValue = data.nama;
            }
            
            if (!pkValue) { 
               return jsonResponse({ success: false, message: `${pk} required for PUT`, data: null }, 400);
            }
            delete data[pk];
            
            const columns = Object.keys(data);
            const setClause = columns.map(c => `${c} = ?`).join(', ');
            const values = [...Object.values(data), pkValue];
            
            const query = `UPDATE ${tableName} SET ${setClause} WHERE ${pk} = ?`;
            await env.d1_database.prepare(query).bind(...values).run();
            
            return jsonResponse({ success: true, message: 'Data updated', data: body });
          }
          if (method === 'DELETE') {
            let pk = 'id';
            let pkValue = body.id;
            if (tableName === 'profil') {
              pk = 'nama';
              pkValue = body.nama;
            }
            
            if (!pkValue) {
               return jsonResponse({ success: false, message: `${pk} required for DELETE`, data: null }, 400);
            }
            const query = `DELETE FROM ${tableName} WHERE ${pk} = ?`;
            await env.d1_database.prepare(query).bind(pkValue).run();
            return jsonResponse({ success: true, message: 'Data deleted', data: { [pk]: pkValue } });
          }
        } catch (dbErr) {
           return jsonResponse({ success: false, message: dbErr.message, data: null }, 500);
        }
      }
      return jsonResponse({ success: false, message: "Method not allowed", data: null }, 405);

    } catch (error) {
      // 5. Error Handling & Logging
      console.error(`Worker Error: ${error.message}`, error.stack);
      
      return jsonResponse({
        success: false,
        message: 'Internal server error',
        error: error.message,
        data: null
      }, 500);
    }
  },
};
