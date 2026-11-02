import { describe, it, expect } from 'vitest';
import {
  encodeShortPathAndSearch,
  decodeRoute,
  getShortUrlForCurrentLocation,
  PATH_LONG_TO_SHORT,
  PATH_SHORT_TO_LONG,
} from '../../src/utils/shortLinkCodec';

describe('ShortLinkCodec Unit Tests', () => {
  it('correctly maps long paths to short paths', () => {
    expect(PATH_LONG_TO_SHORT['search']).toBe('sr');
    expect(PATH_LONG_TO_SHORT['preview']).toBe('prev');
    expect(PATH_SHORT_TO_LONG['sr']).toBe('search');
    expect(PATH_SHORT_TO_LONG['prev']).toBe('preview');
  });

  it('encodes admin search route into canonical short link', () => {
    const shortUrl = encodeShortPathAndSearch('search', { page: 'admin' });
    expect(shortUrl).toBe('/sr?pg=adm');
  });

  it('decodes short admin url to canonical route info', () => {
    const decoded = decodeRoute('/sr?pg=adm');
    expect(decoded.canonicalPathname).toBe('search');
    expect(decoded.pageParam).toBe('admin');
    expect(decoded.isShortFormat).toBe(true);
  });

  it('encodes portfolio preview with color flag into short link', () => {
    const shortUrl = encodeShortPathAndSearch('preview', {
      file: 'portofolio',
      color: 'true',
    });
    expect(shortUrl).toBe('/prev?f=p&cl=true');
  });

  it('decodes short portfolio url correctly', () => {
    const decoded = decodeRoute('/prev?f=p&cl=true');
    expect(decoded.canonicalPathname).toBe('preview');
    expect(decoded.fileParam).toBe('portofolio');
    expect(decoded.isColor).toBe(true);
    expect(decoded.isCompressed).toBe(true);
  });

  it('encodes academic document with specific param correctly', () => {
    const shortUrl = encodeShortPathAndSearch('preview', {
      file: 'akademik',
      spesifik: 'transkrip',
    });
    expect(shortUrl).toBe('/prev?f=a&spec=trk');
  });

  it('decodes academic specific transkrip correctly', () => {
    const decoded = decodeRoute('/prev?f=a&spec=trk');
    expect(decoded.canonicalPathname).toBe('preview');
    expect(decoded.fileParam).toBe('akademik');
    expect(decoded.spesifikParam).toBe('transkrip');
  });

  it('handles CV with custom HEX color and design preset', () => {
    const shortUrl = encodeShortPathAndSearch('preview', {
      file: 'cv',
      color: '0062E3',
      design: 'block',
    });
    expect(shortUrl).toBe('/prev?f=cv&cl=0062E3&ds=blok');

    const decoded = decodeRoute('/prev?f=cv&cl=0062E3&ds=blok');
    expect(decoded.canonicalPathname).toBe('preview');
    expect(decoded.fileParam).toBe('cv');
    expect(decoded.colorParam).toBe('0062E3');
    expect(decoded.designParam).toBe('block');
  });

  it('returns canonical short url for current location', () => {
    const res = getShortUrlForCurrentLocation('/search?page=admin');
    expect(res).toBe('/sr?pg=adm');

    const res2 = getShortUrlForCurrentLocation('/preview?file=portofolio&color=true');
    expect(res2).toBe('/prev?f=p&cl=true');
  });
});
