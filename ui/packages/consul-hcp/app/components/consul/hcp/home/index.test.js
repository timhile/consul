/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import ConsulHcpHome from 'consul-ui/components/consul/hcp/home';

module('Integration | Component | consul hcp home', function(hooks) {
  setupRenderingTest(hooks);

  test('it prints the value of CONSUL_HCP_URL', async function(assert) {
    // temporary registration until we are running as separate applications
    this.owner.register(
      'component:consul/hcp/home',
      ConsulHcpHome
    );
    //

    const Helper = this.owner.resolveRegistration('helper:env');
    this.owner.register(
      'helper:env',
      class extends Helper {
        compute([name, def]) {
          switch(name) {
            case 'CONSUL_HCP_URL':
              return 'http://hcp';
          }
          return super.compute(...arguments);
        }
      }
    );

    await render(hbs`
      <Hds::SideNav::List as |SNL|>
        <Consul::Hcp::Home @list={{SNL}} />
      </Hds::SideNav::List>
    `);

    assert.dom('[data-test-back-to-hcp]').isVisible();
    assert.dom('a').hasAttribute('href', 'http://hcp');

  });

  test('it does not output the Back to HCP link if CONSUL_HCP_URL is not present', async function(assert) {
    // temporary registration until we are running as separate applications
    this.owner.register(
      'component:consul/hcp/home',
      ConsulHcpHome
    );
    //

    const Helper = this.owner.resolveRegistration('helper:env');
    this.owner.register(
      'helper:env',
      class extends Helper {
        compute([name, def]) {
          switch(name) {
            case 'CONSUL_HCP_URL':
              return undefined;
          }
          return super.compute(...arguments);
        }
      }
    );

    await render(hbs`
      <Hds::SideNav::List as |SNL|>
        <Consul::Hcp::Home @list={{SNL}} />
      </Hds::SideNav::List>
    `);

    assert.dom('[data-test-back-to-hcp]').doesNotExist();
    assert.dom('a').doesNotExist();
  });
});
