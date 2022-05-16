/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

/* global sinon */

import React from 'react';

import { mount } from 'enzyme';

import {
  SlotFillRoot,
  Slot
} from '../../slot-fill';

import { Linting } from '../Linting';

import { MIN_HEIGHT } from '../panel/Panel';

const spy = sinon.spy;


describe('Linting', function() {

  it('should render', function() {

    // when
    const wrapper = renderLinting();

    // then
    expect(wrapper.find(Linting).exists()).to.be.true;
  });


  describe('number of errors', function() {

    it('should display 1 error', function() {

      // when
      const wrapper = renderLinting();

      // then
      expect(wrapper.find('.btn').text()).to.equal('1 error');
    });


    it('should display 2 errors', function() {

      // when
      const wrapper = renderLinting({
        linting: [
          ...defaultLinting,
          {
            category: 'error',
            id: 'bar',
            label: 'Bar',
            path: [],
            message: 'Form field of type <checkbox> not supported by Camunda Cloud 1.0'
          }
        ]
      });

      // then
      expect(wrapper.find('.btn').text()).to.equal('2 errors');
    });

  });


  describe('toggle', function() {

    it('should be active (open)', function() {

      // when
      const wrapper = renderLinting({
        layout: {
          panel: {
            open: true,
            tab: 'linting'
          }
        }
      });

      // then
      expect(wrapper.find('.btn').hasClass('btn--active')).to.be.true;
    });


    it('should not be active (closed)', function() {

      // when
      const wrapper = renderLinting();

      // then
      expect(wrapper.find('.btn').hasClass('btn--active')).to.be.false;
    });


    it('should open', function() {

      // given
      const onLayoutChangedSpy = spy();

      const wrapper = renderLinting({
        onLayoutChanged: onLayoutChangedSpy
      });

      // when
      wrapper.find('.btn').simulate('click');

      // then
      expect(onLayoutChangedSpy).to.have.been.calledOnceWith({
        panel: {
          open: true,
          tab: 'linting',
          height: MIN_HEIGHT
        }
      });
    });


    it('should open (different tab open)', function() {

      // given
      const onLayoutChangedSpy = spy();

      const wrapper = renderLinting({
        layout: {
          panel: {
            open: true,
            tab: 'foo'
          }
        },
        onLayoutChanged: onLayoutChangedSpy
      });

      // when
      wrapper.find('.btn').simulate('click');

      // then
      expect(onLayoutChangedSpy).to.have.been.calledOnceWith({
        panel: {
          open: true,
          tab: 'linting',
          height: MIN_HEIGHT
        }
      });
    });


    it('should close', function() {

      // given
      const onLayoutChangedSpy = spy();

      const wrapper = renderLinting({
        layout: {
          panel: {
            open: true,
            tab: 'linting'
          }
        },
        onLayoutChanged: onLayoutChangedSpy
      });

      // when
      wrapper.find('.btn').simulate('click');

      // then
      expect(onLayoutChangedSpy).to.have.been.calledOnceWith({
        panel: {
          open: false,
          tab: 'linting',
          height: 0
        }
      });
    });

  });

});


// helpers //////////

const defaultLayout = {
  panel: {
    open: false,
    tab: 'linting'
  }
};

const defaultLinting = [
  {
    category: 'error',
    id: 'foo',
    label: 'Foo',
    path: [],
    message: 'Form field of type <number> not supported by Camunda Cloud 1.0'
  }
];

function renderLinting(options = {}) {
  const {
    layout = defaultLayout,
    linting = defaultLinting,
    onLayoutChanged
  } = options;

  return mount(
    <SlotFillRoot>
      <Slot name="status-bar__file" />
      <Linting
        layout={ layout }
        linting={ linting }
        onLayoutChanged={ onLayoutChanged } />
    </SlotFillRoot>
  );
}