import { Serializer } from '../TP_webApp/TP_webApp/app/controller/Serializer';
import { CombinedFragment } from '../TP_webApp/TP_webApp/app/model/CombinedFragment';
import { Diagram } from '../TP_webApp/TP_webApp/app/model/Diagram';
import { InteractionOperand } from '../TP_webApp/TP_webApp/app/model/InteractionOperand';
import { Layer } from '../TP_webApp/TP_webApp/app/model/Layer';
import { Lifeline } from '../TP_webApp/TP_webApp/app/model/Lifeline';
import { Message, StoredMessage, MessageKind } from '../TP_webApp/TP_webApp/app/model/Message';
import { OccurenceSpecification } from '../TP_webApp/TP_webApp/app/model/OccurenceSpecification';
import * as Globals from '../TP_webApp/TP_webApp/app/globals';
///<reference path="node_modules/@types/node/index.d.ts"/>
import * as assert from 'assert';
///<reference path="node_modules/@types/mocha/index.d.ts"/>
import * as mocha from 'mocha';

import * as R from 'ramda';
import { Object3D } from 'three';
import { MessageOccurenceSpecification } from '../TP_webApp/TP_webApp/app/model/OccurenceSpecification';


assert.ok(true);


mocha.describe('Serializer pipeline test', () => {
  // diagram
  var diag = new Diagram();

  diag.id = 0;

  // layer
  var l1 = new Layer();

  l1.diagram = diag;

  diag.layers.push(l1);

  // lifelines
  var ll1 = new Lifeline();
  var ll2 = new Lifeline();
  var ll3 = new Lifeline();

  ll1.name = "Lifeline 1";
  ll2.name = "Lifeline 2";
  ll3.name = "Lifeline 3";

  ll1.diagram = diag;
  ll2.diagram = diag;
  ll3.diagram = diag;

  ll1.layer=l1;
  ll2.layer=l1;
  ll3.layer=l1;

  l1.lifelines.push(ll1, ll2, ll3);

  // message 1
  let oc1_1 = new MessageOccurenceSpecification();
  let oc2_1 = new MessageOccurenceSpecification();
  
  oc1_1.diagram = diag;
  oc2_1.diagram = diag;

  oc1_1.layer=l1;
  oc2_1.layer=l1;

  oc1_1.lifeline = ll1;
  oc2_1.lifeline = ll2;

  ll1.occurenceSpecifications.push(oc1_1);
  ll2.occurenceSpecifications.push(oc2_1);

  var m1 = new StoredMessage();

  m1.name = 'Message 1';
  m1.kind = MessageKind.SYNC_CALL;

  m1.diagram = diag;
  m1.layer = l1;

  m1.start = oc1_1;
  m1.end = oc2_1;

  oc1_1.message = m1;
  oc2_1.message = m1;

  l1.messages.push(m1);

  // message 2
  let oc1_2 = new MessageOccurenceSpecification();
  let oc2_2 = new MessageOccurenceSpecification();
  
  oc1_2.diagram = diag;
  oc2_2.diagram = diag;

  oc1_2.layer=l1;
  oc2_2.layer=l1;

  oc1_2.lifeline = ll2;
  oc2_2.lifeline = ll3;

  ll2.occurenceSpecifications.push(oc1_2);
  ll3.occurenceSpecifications.push(oc2_2);

  var m2 = new StoredMessage();

  m2.name = 'Message 2';
  m2.kind = MessageKind.SYNC_CALL;

  m2.diagram = diag;
  m2.layer = l1;

  m2.start = oc1_2;
  m2.end = oc2_2;

  oc1_2.message = m2;
  oc2_2.message = m2;

  l1.messages.push(m2);

  // message 3
  let oc1_3 = new MessageOccurenceSpecification();
  let oc2_3 = new MessageOccurenceSpecification();
  
  oc1_3.diagram = diag;
  oc2_3.diagram = diag;

  oc1_3.layer=l1;
  oc2_3.layer=l1;

  oc1_3.lifeline = ll2;
  oc2_3.lifeline = ll3;

  ll2.occurenceSpecifications.push(oc1_3);
  ll3.occurenceSpecifications.push(oc2_3);

  var m3 = new StoredMessage();

  m3.name = 'Message 3';
  m3.kind = MessageKind.RETURN;

  m3.diagram = diag;
  m3.layer = l1;

  m3.start = oc2_3;
  m3.end = oc1_3;

  oc1_3.message = m3;
  oc2_3.message = m3;

  l1.messages.push(m3);

  // message 3
  let oc1_4 = new MessageOccurenceSpecification();
  let oc2_4 = new MessageOccurenceSpecification();
  
  oc1_4.diagram = diag;
  oc2_4.diagram = diag;

  oc1_4.layer=l1;
  oc2_4.layer=l1;

  oc1_4.lifeline = ll1;
  oc2_4.lifeline = ll2;

  ll1.occurenceSpecifications.push(oc1_4);
  ll2.occurenceSpecifications.push(oc2_4);

  var m4 = new StoredMessage();
  
  m4.name = 'Message 4';
  m4.kind = MessageKind.RETURN;

  m4.diagram = diag;
  m4.layer = l1;

  m4.start = oc2_4;
  m4.end = oc1_4;

  oc1_4.message = m4;
  oc2_4.message = m4;

  l1.messages.push(m4);

  var processedDiagram = Serializer.instance.deserialize(Serializer.instance.serialize(diag));
  mocha.it('should return the same diagram we send to serialization', () => {
    mocha.it('should return the same lifeline contents', () => {
      assert.equal(diag.layers[0].lifelines[0].name, processedDiagram.layers[0].lifelines[0].name); 
      assert.equal(diag.layers[0].lifelines[1].name, processedDiagram.layers[0].lifelines[1].name); 
      assert.equal(diag.layers[0].lifelines[2].name, processedDiagram.layers[0].lifelines[2].name); 
    });
    mocha.it('should return the same message contents', () => {
      assert.equal(diag.layers[0].messages[0].name, processedDiagram.layers[0].messages[0].name);
      assert.equal(diag.layers[0].messages[1].name, processedDiagram.layers[0].messages[1].name);
      assert.equal(diag.layers[0].messages[2].name, processedDiagram.layers[0].messages[2].name);
      assert.equal(diag.layers[0].messages[3].name, processedDiagram.layers[0].messages[3].name); 
    });
    mocha.it('should reconstruct circular refferences', () => {
      assert.equal(diag.layers[0].lifelines[0].occurenceSpecifications[0].lifeline, processedDiagram.layers[0].lifelines[0]);
      assert.equal((diag.layers[0].lifelines[0].occurenceSpecifications[0] as MessageOccurenceSpecification).message, (processedDiagram.layers[0].lifelines[1].occurenceSpecifications[0] as MessageOccurenceSpecification ).message); 
    });
  });
});



