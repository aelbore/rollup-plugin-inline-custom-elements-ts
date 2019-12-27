import { CustomElement } from 'custom-elements-ts'

@CustomElement({
  templateUrl: './hello-world.html',
  styleUrl: './hello-world.css'
})
export class HelloWorld extends HTMLElement {

}