import java.util.Scanner;

// Step 1: Define class with private data (Encapsulation)
class CarbonEmissionCalculator
{
        private String userName;
        private double electricityUnits;   // kWh consumed per day
        private double gasUnits;           // kg of LPG/gas used per day
        private double travelDistance;     // distance traveled per day (km)
        private String travelMode;         // mode of travel used

        private double electricityEmission;
        private double gasEmission;
        private double travelEmission;
        private double totalEmission;

        // Scientific emission factors (kg CO2 per unit) - reference values (CEA / IPCC style averages)
        private static final double ELECTRICITY_FACTOR = 0.82;   // kg CO2 per kWh
        private static final double GAS_FACTOR          = 2.98;  // kg CO2 per kg LPG

        private static final double CAR_FACTOR         = 0.21;  // kg CO2 per km (petrol car)
        private static final double BUS_FACTOR         = 0.10;  // kg CO2 per km (per passenger)
        private static final double TRAIN_FACTOR       = 0.04;  // kg CO2 per km (public transport/metro)
        private static final double BIKE_FACTOR        = 0.05;  // kg CO2 per km (two-wheeler)
        private static final double EV_FACTOR          = 0.05;  // kg CO2 per km (electric vehicle)
        private static final double WALK_CYCLE_FACTOR  = 0.0;   // kg CO2 per km (walk / cycle)

        // Constructor to initialize values
        public CarbonEmissionCalculator(String userName)
        {
                // Input validation for user name
                if (userName != null && !userName.trim().isEmpty())
                {
                        this.userName = userName;
                }//if
                else
                {
                        this.userName = "Guest User";
                        System.out.println("Warning: Name cannot be empty. Defaulting to 'Guest User'.");
                }//else

                this.electricityUnits = 0.0;
                this.gasUnits = 0.0;
                this.travelDistance = 0.0;
                this.travelMode = "None";

                this.electricityEmission = 0.0;
                this.gasEmission = 0.0;
                this.travelEmission = 0.0;
                this.totalEmission = 0.0;
        }//CarbonEmissionCalculator()

        // Step 2: Add method to calculate electricity emission with input validation
        public void calculateElectricityEmission(double units)
        {
                if (units >= 0)
                {
                        this.electricityUnits = units;
                        this.electricityEmission = units * ELECTRICITY_FACTOR;
                        System.out.println("Electricity Emission Calculated: " + electricityEmission + " kg CO2");
                }//if
                else
                {
                        System.out.println("Error: Electricity units cannot be negative.");
                }//else
        }//calculateElectricityEmission()

        // Step 3: Add method to calculate gas emission with input validation
        public void calculateGasEmission(double units)
        {
                if (units >= 0)
                {
                        this.gasUnits = units;
                        this.gasEmission = units * GAS_FACTOR;
                        System.out.println("Gas Emission Calculated: " + gasEmission + " kg CO2");
                }//if
                else
                {
                        System.out.println("Error: Gas units cannot be negative.");
                }//else
        }//calculateGasEmission()

        // Step 4: Add method to calculate travel emission with input validation
        public void calculateTravelEmission(double distance, String mode)
        {
                if (distance < 0)
                {
                        System.out.println("Error: Distance cannot be negative.");
                        return;
                }//if

                double factor;

                switch (mode.toLowerCase())
                {
                        case "car":
                                factor = CAR_FACTOR;
                                break;
                        case "bus":
                                factor = BUS_FACTOR;
                                break;
                        case "train":
                                factor = TRAIN_FACTOR;
                                break;
                        case "bike":
                                factor = BIKE_FACTOR;
                                break;
                        case "ev":
                                factor = EV_FACTOR;
                                break;
                        case "walk":
                        case "cycle":
                                factor = WALK_CYCLE_FACTOR;
                                break;
                        default:
                                System.out.println("Error: Invalid travel mode. Emission not calculated.");
                                return;
                }//switch

                this.travelDistance = distance;
                this.travelMode = mode;
                this.travelEmission = distance * factor;
                System.out.println("Travel Emission Calculated: " + travelEmission + " kg CO2");
        }//calculateTravelEmission()

        // Step 5: Add method to calculate total emission
        public double calculateTotalEmission()
        {
                totalEmission = electricityEmission + gasEmission + travelEmission;
                return totalEmission;
        }//calculateTotalEmission()

        // Step 6: Add method to rate emission level
        public String getEmissionRating()
        {
                if (totalEmission <= 5)
                {
                        return "Low";
                }//if
                else if (totalEmission <= 10)
                {
                        return "Moderate";
                }//else if
                else
                {
                        return "High";
                }//else
        }//getEmissionRating()

        // Step 7: Add method to display full report
        public void displayDetails()
        {
                calculateTotalEmission();

                System.out.println("\n----------------------------------------");
                System.out.println("       DAILY CARBON EMISSION REPORT      ");
                System.out.println("----------------------------------------");
                System.out.println("User               : " + userName);
                System.out.println("Electricity Used   : " + electricityUnits + " kWh  -> " + electricityEmission + " kg CO2");
                System.out.println("Gas Used           : " + gasUnits + " kg    -> " + gasEmission + " kg CO2");
                System.out.println("Travel Mode        : " + travelMode);
                System.out.println("Distance Traveled  : " + travelDistance + " km   -> " + travelEmission + " kg CO2");
                System.out.println("----------------------------------------");
                System.out.println("TOTAL EMISSION     : " + totalEmission + " kg CO2 per day");
                System.out.println("Emission Rating    : " + getEmissionRating());
                System.out.println("----------------------------------------");
        }//displayDetails()
}//class CarbonEmissionCalculator

// Step 8: Define Main Driver Class
public class CarbonFootprintSystem
{
        public static void main(String[] args)
        {
                Scanner scanner = new Scanner(System.in);

                System.out.println("==========================================");
                System.out.println("   WELCOME TO CARBON EMISSION CALCULATOR   ");
                System.out.println("==========================================");

                System.out.print("Enter Your Name: ");
                String name = scanner.nextLine();

                // Instantiate CarbonEmissionCalculator object
                CarbonEmissionCalculator calculator = new CarbonEmissionCalculator(name);
                System.out.println("\nProfile Created Successfully!");

                // Step 9: Create Menu Loop and Input Validation for Choices
                boolean isRunning = true;

                while (isRunning)
                {
                        System.out.println("\n=== MAIN MENU ===");
                        System.out.println("1. Enter Electricity Usage (Services)");
                        System.out.println("2. Enter Gas Usage (Services)");
                        System.out.println("3. Enter Travel Details (Travel)");
                        System.out.println("4. View Total Emission Report");
                        System.out.println("5. Exit");
                        System.out.print("Enter your choice (1-5): ");

                        int choice = scanner.nextInt();

                        switch (choice)
                        {
                                case 1:
                                        System.out.print("Enter electricity consumed today (kWh): ");
                                        double units = scanner.nextDouble();
                                        calculator.calculateElectricityEmission(units);
                                        break;

                                case 2:
                                        System.out.print("Enter gas/LPG used today (kg): ");
                                        double gas = scanner.nextDouble();
                                        calculator.calculateGasEmission(gas);
                                        break;

                                case 3:
                                        System.out.print("Enter distance traveled today (km): ");
                                        double distance = scanner.nextDouble();
                                        scanner.nextLine(); // consume leftover newline before reading text
                                        System.out.print("Enter mode of travel (car/bus/train/bike/ev/walk/cycle): ");
                                        String mode = scanner.nextLine();
                                        calculator.calculateTravelEmission(distance, mode);
                                        break;

                                case 4:
                                        calculator.displayDetails();
                                        break;

                                case 5:
                                        System.out.println("\nThank you for using the Carbon Emission Calculator. Stay Green!");
                                        isRunning = false;
                                        break;

                                default:
                                        System.out.println("Error: Invalid Choice! Select between 1 and 5.");
                        }//switch
                }//while

                scanner.close();
        }//main()
}//class CarbonFootprintSystem