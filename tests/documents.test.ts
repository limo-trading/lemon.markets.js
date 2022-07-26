import client from './client'
import { Document } from '../src/types'

describe('test documents route', () => {

    let documents: Document[];

    it('should get documents', async () => {
        const res = await client.account.documents.get()
        expect(res).toHaveProperty('values')

        documents = res.values

        if(documents.length > 0) {
            expect(res.values[0]).toHaveProperty('id')
            expect(res.values[0]).toHaveProperty('name')
            expect(res.values[0]).toHaveProperty('created_at')
            expect(res.values[0]).toHaveProperty('category')
            expect(res.values[0]).toHaveProperty('link')
            expect(res.values[0]).toHaveProperty('viewed_first_at')
            expect(res.values[0]).toHaveProperty('viewed_last_at')
        }
    })

    it('should be cached', async () => {
        const cache = client.account.documents.cache()
        expect(cache).toEqual(documents)
    })
})