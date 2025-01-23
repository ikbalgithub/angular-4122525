import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getProps'
})
export class GetPropsPipe implements PipeTransform {
  transform(value:any, args:string): any {
    return value.args;
  }

}
