import { PropertyImage } from './../../property-images/entities/property-image.entity';
import { User } from './../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: '' })
  bedrooms: string;

  @Column({ default: '' })
  bathrooms: string;

  @Column()
  address: string;

  @Column({ type: 'float', default: 44.6366 })
  latitude: number;

  @Column({ type: 'float', default: 63.5917 })
  longitude: number;

  @Column({ nullable: true })
  size?: number;

  @Column({ nullable: true })
  url?: string;

  @Column({
    default:
      'https://res.cloudinary.com/dpmleff9w/image/upload/v1649209495/default_af0duf.jpg',
  })
  featuredImage: string;

  @Column({ default: '0' })
  featuredImageId: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => PropertyImage, (propertyImages) => propertyImages.property)
  propertiesImages: PropertyImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
