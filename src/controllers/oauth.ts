import * as express from 'express';
import { NextFunction } from "express";
import { Controller, Put, Path, Request, Response, SuccessResponse, Delete, Get, Body, Post, Route, Tags, Query } from "tsoa";
import { InternalServerError } from '../types/response_types';
import { authorization, decision, token } from '../middelware/passport/passport-oauth2orize';

@Route("oauth") // route name => localhost:xxx/SignUp
@Tags("Authorization - OAuth 2.0") // => Under SignUpController tag
export class OauthController extends Controller {   
  // this.httpServer.get('/dialog/authorize', authorization);
  // this.httpServer.post('/dialog/authorize/decision', decision);
  // this.httpServer.post('/oauth/token', token); 
  
    @Response<InternalServerError>("Oauth API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Get("authorize") //specify the request type
    GetAuthorize(): any {
      return;
    }
    
    @Response<InternalServerError>("Oauth API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Post("decision") //specify the request type
    async PostDecision(): Promise<any> {
      return;
    }
  
    @Response<InternalServerError>("Oauth API Internal Server Error")
    @SuccessResponse("201", "Created") // Custom success response
    @Post("token") //specify the request type
    async PostToken(): Promise<any> {
      return;
    }
}
