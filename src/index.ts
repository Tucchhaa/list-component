import { ListComponent } from "./list-component";

const list = ["New York", "Almaty", "Berlin", "London", "Tokyo", "Beijing", "Wellington"];

const container = document.getElementById("container");

new ListComponent(list, container!);