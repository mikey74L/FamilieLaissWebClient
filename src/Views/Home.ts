import {QueryBuilder} from '../Helper/ODataQueryBuilder/query_builder';
import {FacetGroup} from '../Models/Entities/FacetGroup';
import {EntityManager, Repository} from 'aurelia-orm';
import {autoinject} from 'aurelia-framework';

@autoinject()
export class Home {
  manager: EntityManager;
  repository: Repository;

  constructor(efManager: EntityManager) {
     this.manager = efManager;

     this.repository = this.manager.getRepository('FacetGroup');
  }

  async Test(): Promise<void> {
    // var returnValue: any;

    // var Test: QueryBuilder<FacetGroup> = new QueryBuilder<FacetGroup>();

    // returnValue = Test.equals(x => x.NameGerman, 'Test').toQuery().$filter;

    // alert(returnValue);
    let Test = await this.repository.find()

    alert(Test[0].NameGerman);
  }
}
