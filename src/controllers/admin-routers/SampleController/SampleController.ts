import { Response } from 'express';

export class SampleController {
    private static _instance: SampleController | undefined = undefined;

    protected constructor() {}

    public static async instance(): Promise<SampleController> {
        if (this._instance == null) {
            this._instance = new SampleController();
        }
        return this._instance;
    }

    public readonly indexRoute = async (req: RequestWithAccessToken, res: Response) => {
        res.status(200)
            .json({
                success: true,
                message: 'This is example route',
            })
            .end();
        return;
    };
}
