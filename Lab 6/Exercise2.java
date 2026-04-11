import java.util.*;
import java.util.stream.Collectors;

// Record class for Order
record Order(Long orderId, String description, int amount) {}

public class Exercise2 {
    
    // Order generator method (provided in the assignment)
    static List<Order> orderGenerator(int numberOfOrders) {
        if (numberOfOrders < 100) {
            throw new RuntimeException("Invalid value");
        }
        
        var generatedOrder = new ArrayList<Order>();
        
        for (var i = 0; i <= numberOfOrders; i++) {
            long orderId = (int) (Math.random() * 10);
            generatedOrder.add(new Order(
                orderId,
                "Order" + orderId,
                (int) (Math.random() * 200)
            ));
        }
        return generatedOrder;
    }
    
    // Modified generator for 10 orders (for this exercise)
    static List<Order> generateSampleOrders(int count) {
        List<Order> orders = new ArrayList<>();
        Random rand = new Random();
        
        for (int i = 1; i <= count; i++) {
            long orderId = rand.nextLong(100, 999);
            int amount = rand.nextInt(50, 300);
            orders.add(new Order(orderId, "Product-" + (i % 5 + 1), amount));
        }
        return orders;
    }
    
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("COLLECTIONS & STREAMS MASTERY EXERCISE");
        System.out.println("=".repeat(60));
        
        // Task 1: Generate 10 sample orders and print details
        System.out.println("\n--- TASK 1: Generate and Print 10 Orders ---");
        List<Order> orders = generateSampleOrders(10);
        
        System.out.printf("%-10s %-20s %-10s%n", "Order ID", "Description", "Amount");
        System.out.println("-".repeat(45));
        for (Order order : orders) {
            System.out.printf("%-10d %-20s ₱%-10d%n", order.orderId(), order.description(), order.amount());
        }
        
        // Task 2: Add new order, sort by amount descending, print
        System.out.println("\n--- TASK 2: Add Order & Sort by Amount (Descending) ---");
        Order newOrder = new Order(999L, "New-Product", 175);
        orders.add(newOrder);
        
        orders.sort((o1, o2) -> Integer.compare(o2.amount(), o1.amount()));
        
        System.out.println("Sorted Orders (by amount, highest first):");
        System.out.printf("%-10s %-20s %-10s%n", "Order ID", "Description", "Amount");
        System.out.println("-".repeat(45));
        for (Order order : orders) {
            System.out.printf("%-10d %-20s ₱%-10d%n", order.orderId(), order.description(), order.amount());
        }
        
        // Task 3: Filter amount > 150, map to descriptions, print
        System.out.println("\n--- TASK 3: Filter Amount > 150 & Get Descriptions ---");
        List<String> expensiveDescriptions = orders.stream()
            .filter(order -> order.amount() > 150)
            .map(Order::description)
            .collect(Collectors.toList());
        
        System.out.println("Products with amount > ₱150: " + expensiveDescriptions);
        
        // Task 4: Calculate and print average order amount
        System.out.println("\n--- TASK 4: Average Order Amount ---");
        double averageAmount = orders.stream()
            .mapToInt(Order::amount)
            .average()
            .orElse(0.0);
        System.out.printf("Average Order Amount: ₱%.2f%n", averageAmount);
        
        // Task 5: Group by description and sum amounts
        System.out.println("\n--- TASK 5: Group by Description & Sum Amounts ---");
        Map<String, Integer> groupedByDescription = orders.stream()
            .collect(Collectors.groupingBy(
                Order::description,
                Collectors.summingInt(Order::amount)
            ));
        
        System.out.println("Total amount per product description:");
        System.out.println("-".repeat(35));
        for (Map.Entry<String, Integer> entry : groupedByDescription.entrySet()) {
            System.out.printf("%-20s ₱%d%n", entry.getKey(), entry.getValue());
        }
        
        // Bonus: Additional stream operations demonstration
        System.out.println("\n--- BONUS: Additional Stream Operations ---");
        
        // Find highest amount
        OptionalInt highest = orders.stream().mapToInt(Order::amount).max();
        System.out.println("Highest Order Amount: ₱" + highest.orElse(0));
        
        // Find lowest amount
        OptionalInt lowest = orders.stream().mapToInt(Order::amount).min();
        System.out.println("Lowest Order Amount: ₱" + lowest.orElse(0));
        
        // Count of orders by amount ranges
        long highValueOrders = orders.stream().filter(o -> o.amount() > 200).count();
        long mediumValueOrders = orders.stream().filter(o -> o.amount() >= 100 && o.amount() <= 200).count();
        long lowValueOrders = orders.stream().filter(o -> o.amount() < 100).count();
        
        System.out.println("\nOrder Count by Value Range:");
        System.out.println("  > ₱200: " + highValueOrders + " orders");
        System.out.println("  ₱100-₱200: " + mediumValueOrders + " orders");
        System.out.println("  < ₱100: " + lowValueOrders + " orders");
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("EXERCISE COMPLETED SUCCESSFULLY!");
        System.out.println("=".repeat(60));
    }
}