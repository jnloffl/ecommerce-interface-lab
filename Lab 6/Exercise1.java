import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

// Custom Exception 1
class InvalidInputException extends Exception {
    public InvalidInputException(String message) {
        super(message);
    }
}

// Custom Exception 2
class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

// Abstract Account class
abstract class Account {
    protected String accountNumber;
    protected BigDecimal balance;
    
    public Account(String accountNumber, BigDecimal initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    public abstract void deposit(BigDecimal amount) throws InvalidInputException;
    public abstract void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException;
    
    public BigDecimal getBalance() {
        return balance;
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
}

// InterestBearing Interface
interface InterestBearing {
    BigDecimal calculateInterest();
}

// SavingsAccount class
class SavingsAccount extends Account implements InterestBearing {
    private static final BigDecimal INTEREST_RATE = new BigDecimal("0.03"); // 3%
    
    public SavingsAccount(String accountNumber, BigDecimal initialBalance) {
        super(accountNumber, initialBalance);
    }
    
    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Deposit amount must be positive");
        }
        balance = balance.add(amount);
        System.out.println("Deposited: ₱" + amount + " | New Balance: ₱" + balance);
    }
    
    @Override
    public void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Withdrawal amount must be positive");
        }
        if (amount.compareTo(balance) > 0) {
            throw new InsufficientFundsException("Insufficient funds. Available: ₱" + balance);
        }
        balance = balance.subtract(amount);
        System.out.println("Withdrew: ₱" + amount + " | New Balance: ₱" + balance);
    }
    
    @Override
    public BigDecimal calculateInterest() {
        BigDecimal interest = balance.multiply(INTEREST_RATE);
        return interest.setScale(2, RoundingMode.HALF_UP);
    }
}

// CheckingAccount class
class CheckingAccount extends Account {
    private static final BigDecimal OVERDRAFT_LIMIT = new BigDecimal("5000");
    
    public CheckingAccount(String accountNumber, BigDecimal initialBalance) {
        super(accountNumber, initialBalance);
    }
    
    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Deposit amount must be positive");
        }
        balance = balance.add(amount);
        System.out.println("Deposited: ₱" + amount + " | New Balance: ₱" + balance);
    }
    
    @Override
    public void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Withdrawal amount must be positive");
        }
        BigDecimal availableBalance = balance.add(OVERDRAFT_LIMIT);
        if (amount.compareTo(availableBalance) > 0) {
            throw new InsufficientFundsException("Overdraft limit exceeded. Available with overdraft: ₱" + availableBalance);
        }
        balance = balance.subtract(amount);
        System.out.println("Withdrew: ₱" + amount + " | New Balance: ₱" + balance);
    }
}

// Main class
public class Exercise1 {
    public static void main(String[] args) {
        System.out.println("=".repeat(50));
        System.out.println("BANK ACCOUNT SYSTEM DEMO");
        System.out.println("=".repeat(50));
        
        // Create accounts
        SavingsAccount savings = new SavingsAccount("SAV-001", new BigDecimal("10000"));
        CheckingAccount checking = new CheckingAccount("CHK-001", new BigDecimal("5000"));
        
        List<Account> accounts = new ArrayList<>();
        accounts.add(savings);
        accounts.add(checking);
        
        // Test SavingsAccount
        System.out.println("\n--- SAVINGS ACCOUNT ---");
        System.out.println("Account: " + savings.getAccountNumber());
        System.out.println("Initial Balance: ₱" + savings.getBalance());
        
        try {
            savings.deposit(new BigDecimal("2000"));
            savings.withdraw(new BigDecimal("3000"));
            System.out.println("Interest Earned: ₱" + savings.calculateInterest());
        } catch (InvalidInputException | InsufficientFundsException e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        // Test CheckingAccount
        System.out.println("\n--- CHECKING ACCOUNT ---");
        System.out.println("Account: " + checking.getAccountNumber());
        System.out.println("Initial Balance: ₱" + checking.getBalance());
        
        try {
            checking.withdraw(new BigDecimal("8000")); // Should work with overdraft
            checking.withdraw(new BigDecimal("3000")); // This might fail
        } catch (InvalidInputException | InsufficientFundsException e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        // Test exception handling
        System.out.println("\n--- EXCEPTION TESTING ---");
        try {
            savings.deposit(new BigDecimal("-100"));
        } catch (InvalidInputException e) {
            System.out.println("Caught Exception: " + e.getMessage());
        }
        
        try {
            savings.withdraw(new BigDecimal("100000"));
        } catch (InvalidInputException | InsufficientFundsException e) {
            System.out.println("Caught Exception: " + e.getMessage());
        }
        
        System.out.println("\n--- FINAL BALANCES ---");
        for (Account acc : accounts) {
            System.out.println(acc.getAccountNumber() + ": ₱" + acc.getBalance());
        }
    }
}