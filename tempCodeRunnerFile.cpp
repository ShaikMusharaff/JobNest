#include <iostream>
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <omp.h>
using namespace std;

int main() {
    long long N_values[] = {1000, 10000, 100000, 1000000};
    int thread_counts[] = {2, 4, 8};

    for (int t = 0; t < 3; t++) {
        int num_threads = thread_counts[t];
        cout << "\n--- Running with " << num_threads << " threads (atomic) ---\n";

        for (int i = 0; i < 4; i++) {
            long long N = N_values[i];
            long long count_inside = 0;
            double start_time = omp_get_wtime();

            #pragma omp parallel num_threads(num_threads)
            {
                unsigned int seed = time(NULL) + omp_get_thread_num();
                #pragma omp for
                for (long long j = 0; j < N; j++) {
                    double x = (double)rand_r(&seed) / RAND_MAX * 2.0 - 1.0;
                    double y = (double)rand_r(&seed) / RAND_MAX * 2.0 - 1.0;
                    if (x * x + y * y <= 1.0) {
                        #pragma omp atomic
                        count_inside++;
                    }
                }
            }

            double pi_estimate = 4.0 * (double)count_inside / (double)N;
            double end_time = omp_get_wtime();

            cout << "N = " << N << "  |  Estimated Pi = " << pi_estimate
                 << "  |  Time = " << (end_time - start_time) << " sec\n";
        }
    }

    return 0;
}
