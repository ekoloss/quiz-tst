import * as Joi from 'joi';
import { IGroupCreateBody, IGroupGetListBody, IGroupUpdateBody } from '@models';
import { ValidatorPipe } from '@app/utils';

export const groupCreateBodyValidation = new ValidatorPipe<IGroupCreateBody>(
  Joi.object<IGroupCreateBody>({
    name: Joi.string().required().min(5),
  }),
);

export const groupUpdateBodyValidation = new ValidatorPipe<IGroupUpdateBody>(
  Joi.object<IGroupUpdateBody>({
    id: Joi.string().required(),
    name: Joi.string().required().min(5),
  }),
);

export const groupIdentityBodyValidation = new ValidatorPipe<IGroupUpdateBody>(
  Joi.object<IGroupUpdateBody>({
    id: Joi.string().required(),
  }),
);

export const groupGetListBodyValidation = new ValidatorPipe<IGroupGetListBody>(
  Joi.object<IGroupGetListBody>({
    name: Joi.string().min(3),
    page: Joi.string(),
  }),
);
