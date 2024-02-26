import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 0 })
  cost: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ type: 'float', default: 0 })
  amountSpent: number;
}
