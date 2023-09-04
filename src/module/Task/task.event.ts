import { EventEmitter } from 'events';
import payload from 'payload';

const eventEmitter = new EventEmitter();


eventEmitter.on('deleteRequest', async(id) => {
    await payload.delete({
        collection: "requests",
        id
    });
});


export default eventEmitter;
