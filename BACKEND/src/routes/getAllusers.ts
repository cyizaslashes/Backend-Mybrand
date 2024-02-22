import {Request, Response} from "express";

export default function getAllusers(request: Request , response:Response){
    const users =[
        {
            name: 'Chris',
            email: 'kimenyi@ben.com'
        },
        {
            name: 'Cyiza',
            email: 'cyiza@andela.com'
        },
    ];

    response.statusCode = 200;
    response.send({users});
}