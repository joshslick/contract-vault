// Encryption helpers using Web Crypto API
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bufToBase64(buf) {
	return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64) {
	const bin = atob(b64);
	const len = bin.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
	return bytes.buffer;
}

export async function generateSalt() {
	return crypto.getRandomValues(new Uint8Array(16));
}

async function deriveKey(password, salt) {
	const pwKey = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	);
	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 200000,
			hash: 'SHA-256'
		},
		pwKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

export async function encrypt(plaintext, password) {
	const salt = await generateSalt();
	const key = await deriveKey(password, salt);
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const ct = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		key,
		encoder.encode(plaintext)
	);
	const envelope = {
		version: 1,
		salt: bufToBase64(salt.buffer),
		iv: bufToBase64(iv.buffer),
		ct: bufToBase64(ct)
	};
	return JSON.stringify(envelope);
}

export async function decrypt(envelopeStr, password) {
	const env = JSON.parse(envelopeStr);
	if (env.version !== 1) throw new Error('Unsupported envelope version');
	const salt = base64ToBuf(env.salt);
	const iv = base64ToBuf(env.iv);
	const ct = base64ToBuf(env.ct);
	const key = await deriveKey(password, new Uint8Array(salt));
	const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, key, ct);
	return decoder.decode(plainBuf);
}

export default { encrypt, decrypt };
