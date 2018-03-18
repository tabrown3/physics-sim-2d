/* SystemJS module definition */
import {DynamicBody} from './common/dynamic-body.model';
import {Vec2d} from './common/vec-2d.model';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface Forcable {
  applyLocalForceAtLocalPoint: (pointLFunc: () => Vec2d, forceVecLFunc: () => Vec2d) => () => void;
  forcesBeingAppliedArr: IterableIterator<ForceApplication>;
}

interface MovableEntity extends PhysicalEntity {
  velocity: Vec2d;
  angularVelocity: number;
}

interface PhysicalEntity {
  position: Vec2d;
  angle: number;
  mass: number;
  momentOfInertia: number;
  centerOfMass: Vec2d;
}

interface ForceApplication {
  pointFunc: () => Vec2d;
  forceVecFunc: () => Vec2d;
}
