import fs from 'fs';
import path from 'path';

// Helper to normalize strings
function norm(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

// Explode a list of synonym clusters into a bidirectional map
// where EVERY term in a cluster maps to ALL other terms in that cluster!
export function explodeClusters(clusters: string[][]): Record<string, string[]> {
  const map = new Map<string, Set<string>>();

  for (const rawCluster of clusters) {
    const cluster = Array.from(new Set(rawCluster.map(norm).filter(Boolean)));
    if (cluster.length <= 1) continue;

    for (const term of cluster) {
      let synSet = map.get(term);
      if (!synSet) {
        synSet = new Set<string>();
        map.set(term, synSet);
      }
      for (const other of cluster) {
        if (other !== term) {
          synSet.add(other);
        }
      }
    }
  }

  // Convert map to sorted object
  const result: Record<string, string[]> = {};
  const sortedKeys = Array.from(map.keys()).sort();
  for (const k of sortedKeys) {
    result[k] = Array.from(map.get(k)!).sort();
  }
  return result;
}

console.log('Cluster explosion helper ready.');
