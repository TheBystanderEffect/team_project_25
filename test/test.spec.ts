import { Serializer } from '../TP_webApp/TP_webApp/app/controller/Serializer';
import * as assert from 'assert';
import { CombinedFragment } from '../Tp_webApp/TP_webApp/app/model/CombinedFragment';
import { Diagram } from '../Tp_webApp/TP_webApp/app/model/Diagram';
import { InteractionOperand } from '../Tp_webApp/TP_webApp/app/model/InteractionOperand';
import { Layer } from '../Tp_webApp/TP_webApp/app/model/Layer';
import { Lifeline } from '../Tp_webApp/TP_webApp/app/model/Lifeline';
import { Message } from '../Tp_webApp/TP_webApp/app/model/Message';
import { OccurenceSpecification } from '../Tp_webApp/TP_webApp/app/model/OccurenceSpecification';
import * as Globals from '../Tp_webApp/TP_webApp/app/globals';
import * as R from 'ramda';
import { Object3D } from 'three';

describe('Serializer pipeline test', () => {
  var diag = new Diagram(null,null);
        var ll1 = new Lifeline("ll1"," ",[],l1);
        var ll2 = new Lifeline("ll2"," ",[],l1);
        var ll3 = new Lifeline("ll3"," ",[],l1);
        var l1: Layer = new Layer([ll1,ll2,ll3],[],[]);
        diag.addLayer(l1);
        ll1.layer=l1;
        ll2.layer=l1;
        ll3.layer=l1;
        //var l2 = new Layer([ll3],[],[]);
        let oc1_1 = new OccurenceSpecification(ll1, null);
        ll1.AddOccurenceSpecification(oc1_1);
        let oc2_1 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_1);
        var m1 = new Message("test",1,1,oc1_1, oc2_1);
        l1.AddMessage(m1);
        m1.start.message = m1;
        m1.end.message = m1;
        let oc2_2 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_2);
        let oc3_1 = new OccurenceSpecification(ll3, null);
        ll3.AddOccurenceSpecification(oc3_1);
        var m2 = new Message("test2",1,1,oc2_2, oc3_1);
        l1.AddMessage(m2);
        m2.start.message = m2;
        m2.end.message = m2;
        let oc3_2 = new OccurenceSpecification(ll3, null);
        ll3.AddOccurenceSpecification(oc3_2);
        let oc2_3 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_3);
        var m3 = new Message("test3",1,1,oc3_2, oc2_3);
        l1.AddMessage(m3);
        m3.start.message = m3;
        m3.end.message = m3;
        let oc2_4 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_4);
        let oc1_2 = new OccurenceSpecification(ll1, null);
        ll1.AddOccurenceSpecification(oc1_2);
        var m4 = new Message("test4",1,1, oc2_4, oc1_2);
        l1.AddMessage(m4);
        m4.start.message = m4;
        m4.end.message = m4;
  it('should return type diagram', () => {
    assert.type(Diagram, Serializer.instance.deserialize(Serializer.instance.serialize(diag,true),"Diagram"));
  });
  it('should return the same diagram we send to serialization', () => {
    var processedDiagram = Serializer.instance.deserialize(Serializer.instance.serialize(diag,true),"Diagram");    
    assert.equal(diag, processedDiagram);
  });
  it('should return -1 when the value is not present', () => {
    assert.equal(-1, [1,2,3].indexOf(4));
  });
  

  before(function() {
    // runs before all tests in this block
    //construct test diagram
    
  });
});

