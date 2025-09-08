// src/Domain/Repositories/PlannerRepository.ts
import type { Planner } from "../Entities/Planner";

export interface PlannerRepository {
  load(): Promise<Planner>;
  save(planner: Planner): Promise<void>;
  clear(): Promise<void>;
}
