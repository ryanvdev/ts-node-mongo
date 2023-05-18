export default function findMiddleware(schema: MongooseSchema) {
    schema.pre('find', function () {
        this.where({
            isDeleted: false,
        });
    });

    schema.pre('findOne', function () {
        this.where({
            isDeleted: false,
        });
    });
}
