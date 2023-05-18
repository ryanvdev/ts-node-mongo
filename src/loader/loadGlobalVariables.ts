import { Types } from 'mongoose';

export default function loadGlobalVariables() {
    (global as any).ObjectId = Types.ObjectId;
}
