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
import { OrderDetail } from '../../order_detail/entities/order_detail.entity';
import { User } from '../../user/entities/user.entity';
import { Discount } from '../../discount/entities/discount.entity';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  discount_id: number;

  @Column()
  checkout_link: string;

  @Column()
  external_id: string;

  @Column()
  price: number;

  @Column()
  total_price: number;

  @Column({ default: 'false' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @OneToMany(() => OrderDetail, (order_detail) => order_detail.order)
  orderDetails: OrderDetail[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Discount, (discount) => discount.orders)
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;
}
