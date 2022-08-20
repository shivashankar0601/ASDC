import { Property } from './../../properties/entities/property.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PropertyImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imagePublicId: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  imageDescription?: string;

  @Column()
  propertyId: number;

  @ManyToOne(() => Property, (property) => property.propertiesImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
