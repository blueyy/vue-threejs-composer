import * as THREE from "three";
import { Component, Mixins, Prop, Provide } from "vue-property-decorator";

import { ThreeComponent, ThreeObjectComponent, ThreeSceneComponent } from "./base";

@Component
export class Group extends Mixins(
  ThreeComponent,
  ThreeSceneComponent,
  ThreeObjectComponent
) {
  @Prop({ type: String, default: "" })
  private name!: string;

  @Provide("object")
  public provideObject = this.getObject;

  private m_group!: THREE.Group;
  private m_created = false;

  public getObject(): THREE.Object3D {
    return this.m_group;
  }

  public async created() {
    if (!this.scene && !this.object) {
      throw new Error(
        "Group component can only be added as child to an object or scene component"
      );
    }

    this.m_group = new THREE.Group();
    this.m_group.name = this.name;
    const parent = this.object ? this.object() : this.scene();
    parent.add(this.m_group);

    this.m_created = true;
  }

  public beforeDestroy() {
    const parent = this.object ? this.object() : this.scene();
    parent.remove(this.m_group);
  }

  public render(h: any) {
    if (!this.m_created) {
      return null;
    }
    return h("div", this.$slots.default);
  }
}
