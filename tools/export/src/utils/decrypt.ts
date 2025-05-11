import { nip04, nip44 } from 'nostr-tools';
import { NostrEvent } from '../types.js';

export async function decryptEvents(events: NostrEvent[], privkeyHex: string): Promise<void> {
  const privKey = privkeyHex.startsWith('0x') ? privkeyHex.slice(2) : privkeyHex;
  for (const ev of events) {
    const algoTag = ev.tags.find((t) => t[0] === 'encryption_algo');
    if (!algoTag) continue;
    const algo = algoTag[1];
    if (algo !== 'nip44' && algo !== 'nip04') continue;
    const pubTag = ev.tags.find((t) => t[0] === 'p')?.[1];
    if (!pubTag) continue;
    try {
      let decrypted: string;
      if (algo === 'nip44') {
        decrypted = await (nip44 as any).decrypt(privKey, pubTag, ev.content);
      } else {
        decrypted = await nip04.decrypt(privKey, pubTag, ev.content);
      }
      ev.content = decrypted;
      // Mark decrypted
      ev.tags.push(['decrypted', 'yes']);
    } catch (e) {
      // leave content as-is
      ev.tags.push(['decrypt_error', '1']);
    }
  }
} 