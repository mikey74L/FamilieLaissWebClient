import {QueryBuilder} from '../../Helper/ODataQueryBuilder/query_builder';
import {FacetGroup} from '../../Models/Entities/FacetGroup';
import {EntityManager, Repository} from 'aurelia-orm';
import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {ValidateResult} from 'aurelia-validation';
import {Expression} from '../../Helper/ODataQueryBuilder/expression';
import {enFacetType} from '../../Enum/FamilieLaissEnum';

@autoinject()
export class Home {
  manager: EntityManager;
  repository: Repository;
  entity: FacetGroup;
  client: HttpClient;

  constructor(efManager: EntityManager, client: HttpClient) {
     this.manager = efManager;

     this.repository = this.manager.getRepository('FacetGroup');

     this.client = client;
  }

  async Test(): Promise<void> {
    // var returnValue: any;

    var TestQuery: QueryBuilder<FacetGroup> = new QueryBuilder<FacetGroup>();
        let expression = Expression.or(Expression.equals<FacetGroup, enFacetType>(x => x.Type, enFacetType.Picture), 
                                       Expression.equals<FacetGroup, enFacetType>(x => x.Type, enFacetType.Both));
        TestQuery.filter(expression);                                      


    var Filter = '?$filter=' + TestQuery.toQuery().$filter;

    alert(Filter);

    let result = await this.repository.find(Filter);

    this.entity = result[0];

    alert(this.entity.NameGerman);
  }

  async Update(): Promise<void> {
    this.entity.NameGerman = 'Michael Test';

    await this.entity.update();
  }

  async Delete(): Promise<void> {
    await this.entity.destroy();
  }

  async Insert(): Promise<void> {
    let NewEntity: FacetGroup = this.repository.getNewEntity()

    NewEntity.Type = 0;
    NewEntity.NameEnglish = "labefjkshfkshfksd";
    NewEntity.NameGerman = "Testkategorie";

    let Result: Array<ValidateResult> = await NewEntity.validate();

    for (var Item of Result) {
      if (!Item.valid)     alert(Item.message);
    }

    // await NewEntity.save();

    // alert(NewEntity.ID);
  }
}
