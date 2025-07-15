export function stringToGradient(str: string): string {
    let hash1 = 0, hash2 = 0;
    for (let i = 0; i < str.length; i++) {
        hash1 = str.charCodeAt(i) + ((hash1 << 5) - hash1);
        hash2 = str.charCodeAt(str.length - 1 - i) + ((hash2 << 5) - hash2);
    }
    const h1 = hash1 % 360;
    const h2 = hash2 % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70%, 80%), hsl(${h2}, 70%, 85%))`;
}
