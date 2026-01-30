import { BranchType, DepartmentType } from "modules/integration/domain/Nixpend.js";
import { NixpendPort } from "modules/integration/ports/NixpendPorts.js";

export class GetPractitioners {
    constructor(private nixpendAdapter: NixpendPort) { }
    async exec(branch: BranchType, department?: DepartmentType): Promise<any> {
        try {
            const practitioners = await this.nixpendAdapter.getPractitioners(branch, department);
            return { ok: true, practitioners };
        } catch (err) {
            console.error("[GetPractitioners.exec] Error:", (err as any).message);
            return { ok: false, error: "Internal error" };
        }
    }
}