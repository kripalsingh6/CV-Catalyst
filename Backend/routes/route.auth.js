import express from 'express';
const Router = express.Router();
import passport from 'passport';
import {Showsignup, login ,logout} from './Controller/controller.auth.js'