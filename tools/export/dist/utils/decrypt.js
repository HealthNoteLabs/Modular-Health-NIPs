import { nip04, nip44 } from 'nostr-tools';
export async function decryptEvents(events, privkeyHex) {
    var _a;
    const privKey = privkeyHex.startsWith('0x') ? privkeyHex.slice(2) : privkeyHex;
    for (const ev of events) {
        const algoTag = ev.tags.find((t) => t[0] === 'encryption_algo');
        if (!algoTag)
            continue;
        const algo = algoTag[1];
        if (algo !== 'nip44' && algo !== 'nip04')
            continue;
        const pubTag = (_a = ev.tags.find((t) => t[0] === 'p')) === null || _a === void 0 ? void 0 : _a[1];
        if (!pubTag)
            continue;
        try {
            let decrypted;
            if (algo === 'nip44') {
                decrypted = await nip44.decrypt(privKey, pubTag, ev.content);
            }
            else {
                decrypted = await nip04.decrypt(privKey, pubTag, ev.content);
            }
            ev.content = decrypted;
            // Mark decrypted
            ev.tags.push(['decrypted', 'yes']);
        }
        catch (e) {
            // leave content as-is
            ev.tags.push(['decrypt_error', '1']);
        }
    }
}
