import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')

export function encrypt(text) {
    const iv = crypto.randomBytes(12)

    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)

    const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return JSON.stringify({
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
        tag: authTag.toString('hex')
    })
}

export function decrypt(payload) {
    const { iv, content, tag } = JSON.parse(payload)

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        KEY,
        Buffer.from(iv, 'hex')
    )

    decipher.setAuthTag(Buffer.from(tag, 'hex'))

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(content, 'hex')),
        decipher.final()
    ])

    return decrypted.toString('utf8')
}