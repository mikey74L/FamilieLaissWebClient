import {QueryBuilder} from '../Helper/ODataQueryBuilder/query_builder';
import {FacetGroup} from '../Models/Entities/FacetGroup';

export class Home {
  Test(): void {
    var returnValue: any;

    var Test: QueryBuilder<FacetGroup> = new QueryBuilder<FacetGroup>();

    returnValue = Test.equals(x => x.NameGerman, 'Test').toQuery().$filter;

    alert(returnValue);
  }
}
