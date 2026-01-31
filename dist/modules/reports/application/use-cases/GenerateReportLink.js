export class GenerateReportLink {
    repo;
    blob;
    constructor(repo, blob) {
        this.repo = repo;
        this.blob = blob;
    }
    async exec(id) {
        const doc = await this.repo.findById(id);
        if (!doc)
            throw Object.assign(new Error('NOT_FOUND'), { status: 404, code: 'NOT_FOUND' });
        const url = await this.blob.signedUrl(doc.blobPath, 600);
        return { url };
    }
}
