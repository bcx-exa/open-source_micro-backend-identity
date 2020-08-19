import { Controller, Route, Get, Put, Post, Tags } from 'tsoa';
import AWSXRay from 'aws-xray-sdk';
@Route('HelloWorld') // route name => localhost:xxx/helloWorld
@Tags('HelloWorldController') // => Under HelloWorldController tag    
export class HelloWorldController extends Controller {    
  @Get()  //specify the request type
  hello(): HelloWorldInterface {    
      const segment = AWSXRay.getSegment();
      segment.addAnnotation('method', 'Get');
      segment.addAnnotation('Usage', 'Get Hello World Users');
      segment.addAnnotation('User', 'Martin Greyling')
 
     return {message: 'Hello World!'};  
  }
  @Put()  //specify the request type
  helloPut(): HelloWorldInterface {    
     return {message: 'Hello World!'};  
  }
  @Post()  //specify the request type
  helloPost(): HelloWorldInterface {    
     return {message: 'Hello World!'};  
  }

  
}
export interface HelloWorldInterface {  message: string; }