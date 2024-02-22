import { Request, Response} from 'express';
import getAllUsers from "./getAllusers";

describe('Get all users request',()=>{
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject = {};

    beforeEach(()=>{
        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation(result=>{
                responseObject = result;
            })
        }
    })
  test('200-users', ()=>{
    const expectedStatusCode = 200;
    const expectedResponse = {
        users:[
            {
                name: 'Chris',
                email: 'kimenyi@ben.com'
            },
            {
                name: 'Cyiza',
                email: 'cyiza@andela.com'
            },
        ]
    };

    getAllUsers( mockRequest as Request, mockResponse as Response);

    expect(mockResponse.statusCode).toBe(expectedStatusCode);
    expect(responseObject).toEqual(expectedResponse);
  });
});