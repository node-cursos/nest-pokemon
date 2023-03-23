import * as Joi from 'joi';
import { join } from 'path';

export const JoiValidationSchema = Joi.object({
    MONGODB : Joi.required(),
    PORT: Joi.number().default(3001),
    DEFAULT_LIMIT:  Joi.number().default(7)
})