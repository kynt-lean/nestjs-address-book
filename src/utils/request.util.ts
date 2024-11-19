import { ExecutionContext } from '@nestjs/common';

export const getRequestResponse = (
  context: ExecutionContext,
): {
  request: any;
  response: any;
} => {
  let request, response;
  const ctxType = context.getType();

  switch (ctxType) {
    case 'http':
      request = context.switchToHttp().getRequest();
      response = context.switchToHttp().getResponse();
      break;

    case 'rpc':
      request = context.switchToRpc().getData();
      response = context.switchToRpc().getData();
      break;

    case 'ws':
      request = context.switchToWs().getData();
      response = context.switchToWs().getData();
      break;

    default:
      // graphql
      if (ctxType === 'graphql') {
        request = context.getArgByIndex(2).req;
        response = context.getArgByIndex(2).res;
      }
      break;
  }

  return {
    request,
    response,
  };
};

export const getRequestUser = (context: ExecutionContext): Express.User => {
  const ctxType = context.getType();
  switch (ctxType) {
    case 'http':
      return context.switchToHttp().getRequest().user;

    case 'rpc':
      return context.switchToRpc().getData();

    case 'ws':
      return context.switchToWs().getData();

    default:
      // graphql
      if (ctxType === 'graphql') {
        return context.getArgByIndex(2).req.user;
      }
      return {};
  }
};
