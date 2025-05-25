export function flattenEvent(event) {
    const getTag = (name) => { var _a; return (_a = event.tags.find((t) => t[0] === name)) === null || _a === void 0 ? void 0 : _a[1]; };
    const unit = getTag('unit');
    const timestamp = getTag('timestamp');
    const encrypted = event.tags.some((t) => t[0] === 'encryption_algo' && t[1] === 'nip44');
    return {
        id: event.id,
        kind: event.kind,
        created_at: event.created_at,
        timestamp,
        unit,
        value: event.content,
        encrypted,
    };
}
