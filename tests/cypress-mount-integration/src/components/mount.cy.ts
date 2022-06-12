import { mount } from '@jscutlery/cypress-mount';

import { ChildComponent, ParentComponent } from '../fixtures/child.component';
import { HelloDIComponent } from '../fixtures/hello-dependency-injection.component';
import { HelloComponent } from '../fixtures/hello.component';
import { OutputComponent } from '../fixtures/output.component';
import { TwoWayDataBindingModule } from '../fixtures/two-way-data-binding-component';
import { AppInfo } from '../fixtures/hello-dependency-injection.component';
import { HelloScssComponent } from '../fixtures/hello-scss.component';
import { HelloStyleUrlsComponent } from '../fixtures/hello-style-urls.component';
import { HelloTemplateUrlComponent } from '../fixtures/hello-template-url.component';
import { HelloModule } from '../fixtures/hello.component';

describe('mount', () => {
  it('should handle dependency injection', () => {
    mount(HelloDIComponent);
    cy.contains('JSCutlery');
  });

  it('should handle declarations', () => {
    mount(
      `<jc-parent>
        <jc-child name="💉"></jc-child>
      </jc-parent>`,
      {
        declarations: [ParentComponent, ChildComponent],
      }
    );
    cy.contains('Parent');
    cy.contains('Child 💉');
  });

  it('should handle providers', () => {
    mount(HelloDIComponent, {
      providers: [
        {
          provide: AppInfo,
          useValue: { title: '💉' },
        },
      ],
    });
    cy.contains('💉');
  });

  it('should handle inputs', () => {
    mount(HelloComponent, {
      inputs: {
        name: '🚀',
      },
    });
    cy.contains('🚀');
  });

  it('should handle outputs', () => {
    const outputs = {
      // eslint-disable-next-line
      output(v) {},
    };
    cy.spy(outputs, 'output').as('output');
    mount(OutputComponent, {
      outputs,
    });
    cy.get('button').should('be.visible').click();
    cy.get('@output').should('have.been.calledOnce');
    cy.get('@output').should('have.been.calledWith', 'hello');
  });

  it('should render template', () => {
    mount(
      `<jc-hello name="🚀"></jc-hello>
       <jc-hello name="🌖"></jc-hello>`,
      {
        imports: [HelloModule],
      }
    );
    cy.contains('🚀');
    cy.contains('🌖');
  });

  it('should handle two-way data binding', () => {
    const value = 'first value';
    mount(
      `<jc-two-way-data-binding value="${value}"></jc-two-way-data-binding>`,
      { imports: [TwoWayDataBindingModule] }
    );
    cy.get('input').should('have.value', 'first value');
    cy.get('.value').should('have.text', 'first value');
    cy.get('input').clear().type('second value');
    cy.get('input').should('have.value', 'second value');
    cy.get('.value').should('have.text', 'second value');
  });

  it('should handle templateUrl', () => {
    mount(HelloTemplateUrlComponent);
    cy.contains('JSCutlery');
  });

  it('should handle styleUrls', () => {
    mount(HelloStyleUrlsComponent);
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  it('should handle scss', () => {
    mount(HelloScssComponent);
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  it('should handle global styles', () => {
    mount(HelloComponent, { styles: [`body { color: red }`] });
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  it('should handle css file', () => {
    mount(HelloComponent, { cssFile: './src/fixtures/inline-style.css' });
    cy.get('h1').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  it('should handle css link', () => {
    mount(HelloComponent, {
      stylesheet: 'https://my-css.jscutlery.dev/file.css',
    });
    cy.get('link').should('have.length', 1);
    cy.get('link').should('have.attr', 'rel', 'stylesheet');
    cy.get('link').should(
      'have.attr',
      'href',
      'https://my-css.jscutlery.dev/file.css'
    );
  });
});
