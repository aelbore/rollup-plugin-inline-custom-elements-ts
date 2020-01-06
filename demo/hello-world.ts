import { CustomElement, Prop, Watch } from 'custom-elements-ts'

@CustomElement({
  templateUrl: './hello-world.html',
  styleUrl: './hello-world.scss'
})
export class HelloWorld extends HTMLElement {

  @Prop() message: string;

  @Watch('message')
  onMessagePropertyChange(value: any) {
    const h1 = this.shadowRoot.querySelector('h1')
    h1.innerHTML = `Hello ${this.message}`
  }

}