import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorage } from '../auth/token.storage';

export class AuthHeaderInterceptor implements HttpInterceptor {
	intercept( req: HttpRequest <any>, next: HttpHandler): Observable <HttpEvent<any>> {
			// Clone the request to add the new header
      const token = new TokenStorage();
      const tokenVal = token.getToken();
			const clonedRequest = req.clone({
			headers: req
				.headers
				.set('Authorization', tokenVal ? `Bearer ${ tokenVal}` : '')
		});
    console.log('Interceptor Req: ' + JSON.stringify(clonedRequest));
		// Pass the cloned request instead of the original request to the next handle
		return next.handle( clonedRequest );
	}
}