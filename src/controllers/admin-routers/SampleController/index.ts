import { Router } from 'express';
import { SampleController } from './SampleController';

export default async function loadSampleRouter(parentRouter: Router) {
    const controller = await SampleController.instance();

    // prettier-ignore
    parentRouter.all(
        '/sample',
        controller.indexRoute as any
    );
}
