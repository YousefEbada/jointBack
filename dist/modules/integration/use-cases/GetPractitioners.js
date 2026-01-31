export class GetPractitioners {
    nixpendAdapter;
    constructor(nixpendAdapter) {
        this.nixpendAdapter = nixpendAdapter;
    }
    async exec(branch, department) {
        try {
            const practitioners = await this.nixpendAdapter.getPractitioners(branch, department);
            return { ok: true, practitioners };
        }
        catch (err) {
            console.error("[GetPractitioners.exec] Error:", err.message);
            return { ok: false, error: "Internal error" };
        }
    }
}
