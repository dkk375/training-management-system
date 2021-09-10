import Crypto from 'crypto'

const Random = (size=11) => {
    return Crypto.randomBytes(size).toString('base64').slice(0, size)
}

export default Random