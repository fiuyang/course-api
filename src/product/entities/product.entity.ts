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
import { ProductCategory } from '../../product_category/entities/product_category.entity';
import { ClassRoom } from '../../class_room/entities/class_room.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { OrderDetail } from '../../order_detail/entities/order_detail.entity';

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_category_id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  video: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @ManyToOne(
    () => ProductCategory,
    (product_category) => product_category.products,
  )
  @JoinColumn({ name: 'product_category_id' })
  product_category: ProductCategory;

  @OneToMany(() => ClassRoom, (classRoom) => classRoom.product)
  classRooms: ClassRoom[];

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @OneToMany(() => OrderDetail, (order_detail) => order_detail.product)
  orderDetails: OrderDetail[];
}
