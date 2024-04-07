import getPaginatedEntity from '../../../../actions/api/helpers';

export async function GET(req: Request) {
    return getPaginatedEntity(req.url, 'order');
}
