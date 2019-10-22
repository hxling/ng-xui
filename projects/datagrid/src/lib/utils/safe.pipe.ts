/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 10:11:59
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-22 10:52:14
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {

    constructor(protected sanitizer: DomSanitizer) { }

    public transform(value: any, type: string): string {
        switch (type) {
            case 'html': return this.sanitizer.sanitize( SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(value));
            case 'style': return this.sanitizer.sanitize( SecurityContext.STYLE, this.sanitizer.bypassSecurityTrustStyle(value));
            case 'script': return this.sanitizer.sanitize( SecurityContext.SCRIPT, this.sanitizer.bypassSecurityTrustScript(value));
            case 'url': return this.sanitizer.sanitize( SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(value));
            case 'resourceUrl': return this.sanitizer.sanitize( SecurityContext.RESOURCE_URL,
                                                        this.sanitizer.bypassSecurityTrustResourceUrl(value));
            default: throw new Error(`Invalid safe type specified: ${type}`);
        }
    }

}
