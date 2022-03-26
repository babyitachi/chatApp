const amqp=require('amqplib/callback_api');

amqp.connect('amqp://localhost',(connError,connection)=>{
    if(connError){
        throw connError;
    }
    connection.createChannel((channelError,channel)=>{
        if(channelError){
            throw channelError;
        }
        const QUEUE='messageOutbox';
        channel.assertQueue(QUEUE);
        channel.sendToQueue(QUEUE,Buffer.from('hello from abhishrut'));
        console.log(`message sent to ${QUEUE}`);
        channel.consume(QUEUE,(msg)=>{
            console.log(`we have recieved: ${msg.content.toString()}`);
        },{noAck:true});
    });

});